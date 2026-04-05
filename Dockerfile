# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# WebSharper fordító hibájának megelőzése (ICU stb.)
RUN apt-get update && apt-get install -y \
    libicu-dev \
    zlib1g \
    unzip \
    curl

# Csak az fsproj másolása (ne a .sln!)
COPY Alpha.fsproj .
RUN dotnet restore Alpha.fsproj

# Most jöhet a teljes kód
COPY . .

# Fontos: konkrétan az fsproj-ot publish-eljük, NEM a solutiont!
RUN dotnet publish Alpha.fsproj -c Release -o /app


# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

COPY --from=build /app .
ENTRYPOINT ["dotnet", "Alpha.dll"]