using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using platinum_trophy_helper;
using platinum_trophy_helper.api.models;

namespace MyApp.Namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class notes : ControllerBase
    {
        private readonly string cs;
        public notes(){
            cs = new ConnectionString().cs;
        }
        // GET: api/<notes>
        [HttpGet]
        public List<note> Get()
        {
            List<note> allNotes = new List<note>();
            try
            {
                using (MySqlConnection connection = new MySqlConnection(cs))
                {
                    connection.Open();
                    using (MySqlCommand command = new MySqlCommand("SELECT * FROM notes", connection))
                    {
                        using (MySqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                allNotes.Add(new note
                                {
                                    id = Convert.ToInt32(reader["id"]),
                                    inputText = Convert.ToString(reader["inputText"]),
                                    gameID = Convert.ToInt32(reader["gameID"])
                                    // Add other properties as needed
                                });
                            }
                        }
                    }
                    connection.Close();
                }

                return allNotes;
            }
            catch (Exception ex)
            {
                // Log the exception details (you can replace Console.WriteLine with your logging mechanism)
                Console.WriteLine($"Error in GetAllGames: {ex.Message}");

                // Return an empty list or handle the error appropriately
                return new List<note>();
            }
        }

        // GET api/<notes>/5
        [HttpGet("{id}")]
        public note Get(int id)
        {
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = @"SELECT *FROM notes WHERE id = @id";
            using var cmd = new MySqlCommand(stm,con);
            cmd.Parameters.AddWithValue("@id", id);
            using var rdr = cmd.ExecuteReader();
            // Check if there are rows in the result set
            if (rdr.Read()) {
                // Create a Stock object and populate it with data from the database
                note myNote = new note {
                    id = rdr.GetInt32("id"),
                    inputText = rdr.GetString("inputText"),
                    gameID = rdr.GetInt32("gameID"),
                };
                con.Close(); // Close the connection after reading the data
                return myNote;
            } else {
                // No rows found, return null or throw an exception as appropriate
                con.Close(); // Close the connection
                return null;
            }
        }

        // POST api/<notes>
        [HttpPost]
        public string Post([FromBody] note myNote)
        {
            try
            {
                using (MySqlConnection connection = new MySqlConnection(cs))
                {
                    connection.Open();
                    using (MySqlCommand command = new MySqlCommand(
                        "INSERT INTO notes (inputText, gameID) " +
                        "VALUES (@inputText, @gameID)", connection))
                    {
                        command.Parameters.AddWithValue("@inputText", myNote.inputText);
                        command.Parameters.AddWithValue("@gameID", myNote.gameID);

                        command.Prepare();
                        command.ExecuteNonQuery();

                    }
                    using (MySqlCommand command = new MySqlCommand(
                        "INSERT INTO notes (inputText, gameID) " +
                        "VALUES (@inputText, @gameID)", connection))
                    {
                        command.Parameters.AddWithValue("@inputText", myNote.inputText);
                        command.Parameters.AddWithValue("@gameID", myNote.gameID);

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

        // PUT api/<notes>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] note myNote)
        {
            Post(myNote);
            using var con = new MySqlConnection(cs);
            con.Open();
            string stm = @"UPDATE notes SET id = @id, inputText = @inputText, gameID = @gameID WHERE id = @id";
            using var cmd = new MySqlCommand(stm, con);
            cmd.Parameters.AddWithValue("@id", myNote.id);
            cmd.Parameters.AddWithValue("@inputText", myNote.inputText);
            cmd.Parameters.AddWithValue("@gameID", myNote.gameID);

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

        // DELETE api/<notes>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
