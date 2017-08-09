using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.Http;

namespace blokprty.com_new
{
    public class NonWwwRule : IRule
{
    public void ApplyRule(RewriteContext context)
    {
        var req = context.HttpContext.Request;
        var currentHost = req.Host;
        if (currentHost.Host.StartsWith("www."))
        {
            var newHost = new HostString(currentHost.Host.Substring(4), currentHost.Port ?? 80);
            var newUrl = new StringBuilder().Append("http://").Append(newHost).Append(req.PathBase).Append(req.Path).Append(req.QueryString);
            context.HttpContext.Response.Redirect(newUrl.ToString());
            context.Result = RuleResult.EndResponse;
        }
    }
}
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            var options = new RewriteOptions();
            options.Rules.Add(new NonWwwRule());
            app.UseMvc();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseRewriter(options);
        }
    }
}
