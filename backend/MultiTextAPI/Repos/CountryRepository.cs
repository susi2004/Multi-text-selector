using Microsoft.Data.SqlClient;
using backend.Models;
using backend.Repositories.Interfaces;
using System.Data;

namespace backend.Repositories
{
    public class CountryRepository : ICountryRepository
    {
        private readonly string connectionString;

        public CountryRepository(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<Country>> SearchCountriesAsync(string searchText, int? continentId = null)
        {
            var countries = new List<Country>();

            // Validate input - return empty list for null or empty search text
            if (string.IsNullOrWhiteSpace(searchText))
            {
                return countries;
            }

            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("sp_SearchCountries", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@SearchText", searchText.Trim());
                        if (continentId.HasValue)
                        {
                            cmd.Parameters.AddWithValue("@ContinentId", continentId.Value);
                        }
                        else
                        {
                            cmd.Parameters.AddWithValue("@ContinentId", DBNull.Value);
                        }
                        
                        await conn.OpenAsync();
                        using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                countries.Add(new Country
                                {
                                    Id = Convert.ToInt32(reader["Id"]),
                                    Name = reader["Name"].ToString() ?? string.Empty,
                                    ContinentId = Convert.ToInt32(reader["ContinentId"]),
                                    ContinentName = reader["ContinentName"].ToString() ?? string.Empty
                                });
                            }
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                throw new InvalidOperationException(
                    "An error occurred while searching for countries. Please try again later.",
                    sqlEx
                );
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(
                    "An unexpected error occurred. Please try again later.",
                    ex
                );
            }
            return countries;
        }
    }
}