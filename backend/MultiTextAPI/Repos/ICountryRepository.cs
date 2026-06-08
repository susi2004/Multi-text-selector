using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface ICountryRepository
    {
        Task<List<Country>> SearchCountriesAsync(string searchText, int? continentId = null);
    }
}