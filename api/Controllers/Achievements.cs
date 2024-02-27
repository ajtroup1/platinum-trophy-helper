using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using platinum_trophy_helper;
using platinum_trophy_helper.api.models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class Achievements : ControllerBase
    {
        private readonly string cs;

        public Achievements(){
            cs = new ConnectionString().cs;
        }

        // GET: api/<Achievements>
        [HttpGet]
        public List<achievement> Get()
        {
            List<achievement> achievements = new List<achievement>();

             try
            {
                using (MySqlConnection connection = new MySqlConnection(cs))
                {
                    connection.Open();
                    using (MySqlCommand command = new MySqlCommand("SELECT * FROM achievements", connection))
                    {
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                achievements.Add(new achievement
                                {
                                    id = Convert.ToInt32(reader["id"]),
                                    name = Convert.ToString(reader["Aname"]),
                                    desc = Convert.ToString(reader["Adesc"]),
                                    rarity = Convert.ToDouble(reader["rarity"]),
                                    dateUnlocked = Convert.ToString(reader["dateUnlocked"]),
                                    gameID = Convert.ToInt32(reader["gameID"]),
                                    completed = Convert.ToBoolean(reader["completed"])
                                    // Add other properties as needed
                                });
                            }
                        }
                    }
                    connection.Close();
                }

                return achievements;
            }
            catch (Exception ex)
            {
                // Log the exception details (you can replace Console.WriteLine with your logging mechanism)
                Console.WriteLine($"Error in GetAllGames: {ex.Message}");

                // Return an empty list or handle the error appropriately
                return new List<achievement>();
            }
        }

        // GET api/<Achievements>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<Achievements>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<Achievements>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<Achievements>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
