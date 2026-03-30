FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Node.js telepítése (WebSharper F# fordítóhoz kell)
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# esbuild telepítés
RUN npm install -g esbuild

# Copy fsproj
COPY Alpha.fsproj .
RUN dotnet restore

# Copy the rest
COPY . .

# Publish
RUN dotnet publish -c Release -o /app

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "Alpha.dll"]