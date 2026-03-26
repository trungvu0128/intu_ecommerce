FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/API/LotusEcommerce.API.csproj", "src/API/"]
COPY ["src/Application/LotusEcommerce.Application.csproj", "src/Application/"]
COPY ["src/Domain/LotusEcommerce.Domain.csproj", "src/Domain/"]
COPY ["src/Infrastructure/LotusEcommerce.Infrastructure.csproj", "src/Infrastructure/"]
RUN dotnet restore "src/API/LotusEcommerce.API.csproj"
COPY . .
WORKDIR "/src/src/API"
RUN dotnet build "LotusEcommerce.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "LotusEcommerce.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "LotusEcommerce.API.dll"]
