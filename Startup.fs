open System
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.Hosting
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.DependencyInjection
open Microsoft.AspNetCore.Hosting 
open WebSharper.AspNetCore
open Alpha

[<EntryPoint>]
let main args =
    let builder = WebApplication.CreateBuilder(args)
    builder.WebHost.UseUrls("http://0.0.0.0:10000")
    |> ignore
    builder.Services
        .AddWebSharper()
        .AddAuthentication("WebSharper")
        .AddCookie("WebSharper", fun options -> ())
    |> ignore

    let app = builder.Build()

    if not (app.Environment.IsDevelopment()) then
        app.UseExceptionHandler("/Error")
           .UseHsts()
        |> ignore

    app.UseHttpsRedirection()
#if DEBUG        
        .UseWebSharperScriptRedirect(startVite = true)
#endif
        .UseAuthentication()
        .UseStaticFiles()
        .UseWebSharper(fun ws -> ws.Sitelet(Site.Main) |> ignore)  
    |> ignore

    app.Run()
    0