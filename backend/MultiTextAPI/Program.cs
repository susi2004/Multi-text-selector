using backend.Repositories;
using backend.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);


// Add services
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

// Dependency Injection
builder.Services.AddScoped<
    ICountryRepository,
    CountryRepository
>();


// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowReact",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


var app = builder.Build();


// Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI();
}


// Middleware
app.UseHttpsRedirection();

app.UseCors("AllowReact");

app.UseAuthorization();


// Controllers
app.MapControllers();

app.Run();