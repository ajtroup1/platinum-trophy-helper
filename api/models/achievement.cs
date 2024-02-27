namespace platinum_trophy_helper.api.models
{
    public class achievement
    {
        public int id {get; set;}
        public string name {get; set;}
        public string desc {get; set;}
        public double rarity {get; set;}
        public string dateUnlocked {get; set;}
        public int gameID {get; set;}
        public bool completed {get; set;}
    }
}