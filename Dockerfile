# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src

RUN apt-get update && apt-get install -y \
    libicu-dev \
    zlib1g \
    unzip \
    curl \
    libssl-dev \
    libkrb5-3 \
    libgssapi-krb5-2

COPY Alpha.fsproj ./Alpha.fsproj
RUN dotnet restore Alpha.fsproj

COPY . .

RUN dotnet publish Alpha.fsproj -c Release -o /app

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app .
ENTRYPOINT ["dotnet", "Alpha.dll"]