using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using platinum_trophy_helper;
using platinum_trophy_helper.api.models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class games : ControllerBase
    {
        private readonly string cs;

        public games(){
            cs = new ConnectionString().cs;
        }

        // GET: api/<games>
        [HttpGet]
        public List<game> Get()
        {
            List<game> games = new List<game>();

            try
            {
                using (MySqlConnection connection = new MySqlConnection(cs))
                {
                    connection.Open();
                    using (MySqlCommand command = new MySqlCommand("SELECT * FROM games", connection))
                    {
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                int? playTime = reader["playTime"] as int?;
                                games.Add(new game
                                {
                                    id = Convert.ToInt32(reader["id"]),
                                    name = Convert.ToString(reader["gameName"]),
                                    totalAchievements = Convert.ToInt32(reader["totalAchievements"]),
                                    compAchievements = Convert.ToInt32(reader["compAchievements"]),
                                    completed = Convert.ToBoolean(reader["completed"]),
                                    playTime = playTime.HasValue ? Convert.ToInt32(playTime) : 0, // Handle null value
                                    difficulty = Convert.ToInt32(reader["difficulty"]),
                                    playthroughs = Convert.ToInt32(reader["playthroughs"]),
                                    imgURL = Convert.ToString(reader["imgURL"]),
                                    // Add other properties as needed
                                });
                            }
                        }
                    }
                    connection.Close();
                }

                return games;
            }
            catch (Exception ex)
            {
                // Log the exception details (you can replace Console.WriteLine with your logging mechanism)
                Console.WriteLine($"Error in GetAllGames: {ex.Message}");

                // Return an empty list or handle the error appropriately
                return new List<game>();
            }
        }

        // GET api/<games>/5
        [HttpGet("{id}")]
        public game Get(int id)
        {
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = @"SELECT *FROM games WHERE id = @id";
            using var cmd = new MySqlCommand(stm,con);
            cmd.Parameters.AddWithValue("@id", id);
            using var rdr = cmd.ExecuteReader();
            // Check if there are rows in the result set
            if (rdr.Read()) {
                // Create a Stock object and populate it with data from the database
                game myGame = new game {
                    id = rdr.GetInt32("id"),
                    name = rdr.GetString("gameName"),
                    totalAchievements = rdr.GetInt32("totalAchievements"),
                    compAchievements = rdr.GetInt32("compAchievements"),
                    completed = rdr.GetBoolean("completed"),
                    playTime = rdr.IsDBNull(rdr.GetOrdinal("playTime")) ? null : (int?)rdr.GetInt32("playTime"),
                    difficulty = rdr.GetInt32("difficulty"),
                    playthroughs = rdr.GetInt32("playthroughs"),
                    imgURL = rdr.GetString("imgURL"),
                };
                con.Close(); // Close the connection after reading the data
                return myGame;
            } else {
                // No rows found, return null or throw an exception as appropriate
                con.Close(); // Close the connection
                return null;
            }
        }

        // POST api/<games>
        [HttpPost]
        public string Post([FromBody] addGame myGame)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(cs))
                {
                    connection.Open();
                    using (MySqlCommand command = new MySqlCommand(
                        "INSERT INTO games (gameName, totalAchievements, compAchievements, completed, playTime, difficulty, playthroughs, imgURL) " +
                        "VALUES (@name, @totalAch, @currAch, @comp, @time, @diff, @play, @imgurl)", connection))
                    {
                        command.Parameters.AddWithValue("@name", myGame.name);
                        command.Parameters.AddWithValue("@totalAch", myGame.totalAchievements);
                        command.Parameters.AddWithValue("@currAch", myGame.compAchievements);
                        command.Parameters.AddWithValue("@comp", false);
                        command.Parameters.AddWithValue("@time", 0);
                        command.Parameters.AddWithValue("@diff", 0);
                        command.Parameters.AddWithValue("@play", 0);
                        command.Parameters.AddWithValue("@imgurl", myGame.imgURL);

                        command.Prepare();
                        command.ExecuteNonQuery();
                    }
                    connection.Close();
                }

                return "Transaction added successfully";
            }
            catch (Exception ex)
            {
                // Log the exception details (you can replace Console.WriteLine with your logging mechanism)
                Console.WriteLine($"Error in PostTransaction: {ex.Message}");

                // Return a more informative error message
                return $"Error adding transaction: {ex.Message}";
            }
        }

        // PUT api/<games>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] game myGame)
        {
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = @"UPDATE games SET gameName = @name, totalAchievements = @totAch, compAchievements = @compAch, completed = @comp, playTime = @playtime, difficulty = @difficulty, playthroughs = @playthroughs, imgURL = @imgurl WHERE id = @id";
            using var cmd = new MySqlCommand(stm, con);
            cmd.Parameters.AddWithValue("@name", myGame.name);
            cmd.Parameters.AddWithValue("@totAch", myGame.totalAchievements);
            cmd.Parameters.AddWithValue("@compAch", myGame.compAchievements);
            cmd.Parameters.AddWithValue("@comp", myGame.completed);
            cmd.Parameters.AddWithValue("@playtime", myGame.playTime);
            cmd.Parameters.AddWithValue(@"difficulty", myGame.difficulty);
            cmd.Parameters.AddWithValue("@playthroughs", myGame.playthroughs);
            cmd.Parameters.AddWithValue("@imgurl", myGame.imgURL);
            cmd.Parameters.AddWithValue("@id", myGame.id);

            // Execute the UPDATE statement and get the number of affected rows
            int rowsAffected = cmd.ExecuteNonQuery();

            if (rowsAffected > 0) {
                // The update was successful
                con.Close(); // Close the connection after the update
            } else {
                // No rows matched the update condition, handle it as appropriate
                con.Close(); // Close the connection
                Console.WriteLine("No rows matched the update condition");
            }
        }

        // DELETE api/<games>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
