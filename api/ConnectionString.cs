namespace platinum_trophy_helper
{
    public class ConnectionString
    {
        public string cs {get; set;}

        public ConnectionString(){
            string server = "s0znzigqvfehvff5.cbetxkdyhwsb.us-east-1.rds.amazonaws.com";
            string database = "vzcvc512l3g9tcdo";
            string port = "3306";
            string userName = "mgef0q2q1da43ulg";
            string password = "vklrf5pecfm4wiuh";

            cs = $@"server = {server};user = {userName};database = {database};port = {port};password = {password};";
        }
    }
}