using Microsoft.AspNetCore.Mvc;
using backend.Repositories.Interfaces;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CountriesController : ControllerBase
    {
        private readonly ICountryRepository repository;
        private readonly ILogger<CountriesController> logger;
        public CountriesController(
            ICountryRepository repository,
            ILogger<CountriesController> logger
        )
        {
            this.repository = repository;
            this.logger = logger;
        }
        [HttpGet]   
        public async Task<IActionResult> GetCountries(
            [FromQuery] string search = "",
            [FromQuery] int? continentId = null
        )
        {      
            try
            {if (string.IsNullOrWhiteSpace(search))
                {
                    return Ok(new List<object>());
                }
                var result = await repository.SearchCountriesAsync(search.Trim(), continentId);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                logger.LogError(ex, "Database error while searching countries");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error while searching countries");
                return StatusCode(500, new { message = "An unexpected error occurred" });
            }
        }
    }
}