FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Install node.js - required for WebSharper compiler
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    node --version && npm --version

COPY . .

RUN dotnet restore Alpha.fsproj

# Make WebSharper scripts executable after restore
RUN find /root/.nuget -name "*.sh" -exec chmod +x {} \;

# Try with verbose output to see exact error
RUN dotnet publish Alpha.fsproj -c Release -o /app/publish /p:WebSharperUseBooster=false || \
    (cat /tmp/websharper*.log 2>/dev/null; exit 1)

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000
ENTRYPOINT ["dotnet", "Alpha.dll"]