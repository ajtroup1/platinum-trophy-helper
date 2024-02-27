namespace platinum_trophy_helper
{
    public class game
    {
        public int id {get; set;}
        public string name {get; set;}
        public int totalAchievements {get; set;}
        public int compAchievements {get; set;}
        public bool completed {get; set;}
        public int? playTime {get; set;}
        public int difficulty {get; set;}
        public int playthroughs {get; set;}
        public string imgURL {get; set;}

        public game(){
            playTime = null;
        }
    }
}