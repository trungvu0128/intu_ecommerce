using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LotusEcommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddInventoryReasonAndTransactionUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AspectRatio",
                table: "FeaturedSections");

            migrationBuilder.DropColumn(
                name: "AspectRatio",
                table: "FeaturedSectionItems");

            migrationBuilder.DropColumn(
                name: "GridType",
                table: "FeaturedSectionItems");

            migrationBuilder.AddColumn<Guid>(
                name: "CreatedByUserId",
                table: "InventoryTransactions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ReasonId",
                table: "InventoryTransactions",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "InventoryReasons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Type = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InventoryReasons", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransactions_ReasonId",
                table: "InventoryTransactions",
                column: "ReasonId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryTransactions_InventoryReasons_ReasonId",
                table: "InventoryTransactions",
                column: "ReasonId",
                principalTable: "InventoryReasons",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryTransactions_InventoryReasons_ReasonId",
                table: "InventoryTransactions");

            migrationBuilder.DropTable(
                name: "InventoryReasons");

            migrationBuilder.DropIndex(
                name: "IX_InventoryTransactions_ReasonId",
                table: "InventoryTransactions");

            migrationBuilder.DropColumn(
                name: "CreatedByUserId",
                table: "InventoryTransactions");

            migrationBuilder.DropColumn(
                name: "ReasonId",
                table: "InventoryTransactions");

            migrationBuilder.AddColumn<string>(
                name: "AspectRatio",
                table: "FeaturedSections",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AspectRatio",
                table: "FeaturedSectionItems",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GridType",
                table: "FeaturedSectionItems",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
