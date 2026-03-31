using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using LotusEcommerce.Application.DTOs;
using LotusEcommerce.Application.Interfaces;
using LotusEcommerce.Application.Models;
using LotusEcommerce.Domain.Entities;
using LotusEcommerce.Domain.Enums;
using LotusEcommerce.Domain.Exceptions;
using LotusEcommerce.Domain.Interfaces;

namespace LotusEcommerce.Application.Services;

public class OrderService : IOrderService
{
		private readonly IOrderRepository _orderRepository;

		private readonly IProductRepository _productRepository;

		private readonly ICouponRepository _couponRepository;

		private readonly IAddressRepository _addressRepository;

		private readonly ICartRepository _cartRepository;

		public OrderService(IOrderRepository orderRepository, IProductRepository productRepository, ICouponRepository couponRepository, IAddressRepository addressRepository, ICartRepository cartRepository)
		{
			_orderRepository = orderRepository;
			_productRepository = productRepository;
			_couponRepository = couponRepository;
			_addressRepository = addressRepository;
			_cartRepository = cartRepository;
		}

		public async Task<OrderDto> CreateOrderAsync(CheckoutDto checkoutDto)
		{
			List<CheckoutItemDto> items = checkoutDto.GuestItems;
			if (items == null || items.Count == 0)
			{
				throw new BadRequestException("No items provided for checkout");
			}
			return await BuildAndSaveOrderAsync(checkoutDto, items, null);
		}

		public async Task<OrderDto> CheckoutFromCartAsync(Guid userId, CheckoutDto checkoutDto)
		{
			Cart cart = await _cartRepository.GetByUserIdAsync(userId);
			if (cart == null || cart.Items.Count == 0)
			{
				throw new BadRequestException("Your cart is empty");
			}
			List<CheckoutItemDto> items = cart.Items.Select((CartItem i) => new CheckoutItemDto
			{
				ProductVariantId = i.ProductVariantId,
				Quantity = i.Quantity
			}).ToList();
			OrderDto order = await BuildAndSaveOrderAsync(checkoutDto, items, userId);
			_cartRepository.Delete(cart);
			await _cartRepository.SaveChangesAsync();
			return order;
		}

		private async Task<OrderDto> BuildAndSaveOrderAsync(CheckoutDto checkoutDto, List<CheckoutItemDto> items, Guid? userId)
		{
			string addressSnapshot;
			if (checkoutDto.ShippingAddressId != Guid.Empty)
			{
				Address address = await _addressRepository.GetByIdAsync(checkoutDto.ShippingAddressId);
				if (address == null)
				{
					throw new BadRequestException("Shipping address not found");
				}
				addressSnapshot = JsonSerializer.Serialize(address);
			}
			else
			{
				var inlineAddress = new
				{
					RecipientName = (checkoutDto.RecipientName ?? ""),
					PhoneNumber = (checkoutDto.PhoneNumber ?? ""),
					Email = (checkoutDto.Email ?? ""),
					Street = (checkoutDto.Street ?? ""),
					City = (checkoutDto.City ?? ""),
					State = (checkoutDto.State ?? ""),
					ZipCode = (checkoutDto.ZipCode ?? ""),
					Country = (checkoutDto.Country ?? "VN")
				};
				addressSnapshot = JsonSerializer.Serialize(inlineAddress);
			}
			List<OrderItem> orderItems = new List<OrderItem>();
			decimal subTotal = default(decimal);
			foreach (CheckoutItemDto item in items)
			{
				ProductVariant variant = await _productRepository.GetVariantByIdAsync(item.ProductVariantId);
				if (variant == null)
				{
					throw new BadRequestException($"Product variant {item.ProductVariantId} not found");
				}
				if (variant.StockQuantity < item.Quantity)
				{
					throw new BadRequestException("Insufficient stock for " + variant.Sku);
				}
				Product product = await _productRepository.GetByIdAsync(variant.ProductId);
				decimal unitPrice = product.BasePrice + variant.PriceAdjustment;
				decimal itemTotal = unitPrice * (decimal)item.Quantity;
				orderItems.Add(new OrderItem
				{
					ProductVariantId = item.ProductVariantId,
					ProductName = product.Name,
					Sku = variant.Sku,
					Price = unitPrice,
					Quantity = item.Quantity,
					Total = itemTotal
				});
				subTotal += itemTotal;
			}
			decimal discountAmount = default(decimal);
			if (!string.IsNullOrEmpty(checkoutDto.CouponCode))
			{
				Coupon coupon = await _couponRepository.GetByCodeAsync(checkoutDto.CouponCode);
				if (coupon?.IsValid(subTotal) ?? false)
				{
					discountAmount = coupon.CalculateDiscount(subTotal);
					coupon.UsedCount++;
					_couponRepository.Update(coupon);
				}
			}
			decimal shippingCost = ((!(subTotal > 1000000m)) ? 45000 : 0);
		decimal totalAmount = subTotal + shippingCost - discountAmount;
		Order order = new Order
		{
			UserId = userId,
			OrderNumber = GenerateOrderNumber(),
			Status = OrderStatus.Pending,
			SubTotal = subTotal,
			ShippingCost = shippingCost,
			DiscountAmount = discountAmount,
			CouponCode = checkoutDto.CouponCode,
			TotalAmount = totalAmount,
			ShippingAddress = addressSnapshot,
			PaymentMethod = checkoutDto.PaymentMethod,
			PaymentStatus = PaymentStatus.Pending,
			Items = orderItems
		};
			await _orderRepository.AddAsync(order);
			foreach (CheckoutItemDto item2 in items)
			{
				ProductVariant variant2 = await _productRepository.GetVariantByIdAsync(item2.ProductVariantId);
				if (variant2 != null)
				{
					await _productRepository.UpdateStockAsync(variant2.Id, variant2.StockQuantity - item2.Quantity);
				}
			}
			await _orderRepository.SaveChangesAsync();
			return MapToDto(order);
		}

		public async Task<OrderCalculationResponse> CalculateOrderAsync(OrderCalculationRequest request)
		{
			OrderCalculationResponse response = new OrderCalculationResponse();
			decimal subTotal = default(decimal);
			foreach (CheckoutItemDto item in request.Items)
			{
				ProductVariant variant = await _productRepository.GetVariantByIdAsync(item.ProductVariantId);
				if (variant == null)
				{
					Product productFallback = await _productRepository.GetByIdAsync(item.ProductVariantId);
					if (productFallback != null)
					{
						decimal unitPrice = productFallback.BasePrice;
						subTotal += unitPrice * (decimal)item.Quantity;
					}
				}
				else
				{
					Product product = await _productRepository.GetByIdAsync(variant.ProductId);
					if (product != null)
					{
						decimal unitPrice2 = product.BasePrice + variant.PriceAdjustment;
						subTotal += unitPrice2 * (decimal)item.Quantity;
					}
				}
			}
			response.SubTotal = subTotal;
			if (!string.IsNullOrEmpty(request.CouponCode))
			{
				Coupon coupon = await _couponRepository.GetByCodeAsync(request.CouponCode);
				if (coupon != null)
				{
					if (coupon.IsValid(subTotal))
					{
						response.DiscountAmount = coupon.CalculateDiscount(subTotal);
						response.IsCouponValid = true;
					}
					else
					{
						response.IsCouponValid = false;
						response.CouponError = "Coupon requirements not met";
					}
				}
				else
				{
					response.IsCouponValid = false;
					response.CouponError = "Invalid coupon code";
				}
			}
			response.ShippingCost = ((!(subTotal > 1000000m)) ? 45000 : 0);
			response.TotalAmount = response.SubTotal + response.ShippingCost - response.DiscountAmount;
			return response;
		}

		public async Task<OrderDto?> GetOrderByIdAsync(Guid id)
		{
			Order order = await _orderRepository.GetByIdAsync(id);
			return (order != null) ? MapToDto(order) : null;
		}

		public async Task<OrderDto?> GetOrderByNumberAsync(string orderNumber)
		{
			Order order = await _orderRepository.GetByOrderNumberAsync(orderNumber);
			return (order != null) ? MapToDto(order) : null;
		}

		public async Task<IEnumerable<OrderDto>> GetUserOrdersAsync(Guid userId)
		{
			return (await _orderRepository.GetUserOrdersAsync(userId)).Select(MapToDto);
		}

		public async Task<IEnumerable<OrderDto>> GetAllOrdersAsync(OrderStatus? status = null)
		{
			return (await _orderRepository.GetAllAsync(status)).Select(MapToDto);
		}

		public async Task<bool> UpdateOrderStatusAsync(Guid orderId, OrderStatus status)
		{
			Order order = await _orderRepository.GetByIdAsync(orderId);
			if (order == null)
			{
				return false;
			}
			order.Status = status;
			_orderRepository.Update(order);
			return await _orderRepository.SaveChangesAsync();
		}

		public async Task<bool> UpdateOrderInfoAsync(Guid orderId, UpdateOrderDto dto)
		{
			Order order = await _orderRepository.GetByIdAsync(orderId);
			if (order == null) return false;

			if (dto.Status.HasValue) order.Status = dto.Status.Value;
			if (dto.PaymentStatus.HasValue) order.PaymentStatus = dto.PaymentStatus.Value;
			if (dto.ShippingAddress != null) order.ShippingAddress = dto.ShippingAddress;

			_orderRepository.Update(order);
			return await _orderRepository.SaveChangesAsync();
		}

		public async Task<bool> MarkOrderAsPaidAsync(string orderNumber)
		{
			Order order = await _orderRepository.GetByOrderNumberAsync(orderNumber);
			if (order == null)
			{
				return false;
			}
			order.PaymentStatus = PaymentStatus.Completed;
			if (order.Status == OrderStatus.Pending)
			{
				order.Status = OrderStatus.Processing;
			}
			_orderRepository.Update(order);
			return await _orderRepository.SaveChangesAsync();
		}

		public async Task<bool> CancelOrderAsync(Guid orderId)
		{
			Order order = await _orderRepository.GetByIdAsync(orderId);
			if (order == null || order.Status == OrderStatus.Cancelled)
			{
				return false;
			}
			foreach (OrderItem item in order.Items)
			{
				if (item.ProductVariantId.HasValue)
				{
					ProductVariant variant = await _productRepository.GetVariantByIdAsync(item.ProductVariantId.Value);
					if (variant != null)
					{
						await _productRepository.UpdateStockAsync(variant.Id, variant.StockQuantity + item.Quantity);
					}
				}
			}
			order.Status = OrderStatus.Cancelled;
			_orderRepository.Update(order);
			return await _orderRepository.SaveChangesAsync();
		}

		private string GenerateOrderNumber()
		{
			return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
		}

		private OrderDto MapToDto(Order order)
		{
			return new OrderDto
			{
				Id = order.Id,
				OrderNumber = order.OrderNumber,
				Status = order.Status,
				TotalAmount = order.TotalAmount,
				SubTotal = order.SubTotal,
				ShippingCost = order.ShippingCost,
				DiscountAmount = order.DiscountAmount,
				CouponCode = order.CouponCode,
				ShippingAddress = order.ShippingAddress,
				PaymentStatus = order.PaymentStatus,
				PaymentMethod = order.PaymentMethod,
				CreatedAt = order.CreatedAt,
				Items = order.Items.Select((OrderItem i) => new OrderItemDto
				{
					ProductVariantId = i.ProductVariantId,
					ProductName = i.ProductName,
					Sku = i.Sku,
					Price = i.Price,
					Quantity = i.Quantity,
					Total = i.Total
				}).ToList()
			};
		}
	}
