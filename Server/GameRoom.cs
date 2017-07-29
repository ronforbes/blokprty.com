using System;
using System.Threading;
using System.Diagnostics;
using System.Collections.Generic;
using System.Collections;

namespace blokprty.com_new {
    public class GameRoom {
        static GameRoom instance;
        public static GameRoom Instance {
            get {
                if(instance == null) {
                    instance = new GameRoom();
                }
                return instance;
            }
        }

        public enum GameState {
            Game,
            Results,
            Leaderboard
        }

        public GameState State;
        public float TimeRemaining;
        DateTime previousTime;

        const float gameDuration = 120000.0f;
        const float resultsDuration = 15000.0f;
        const float leaderboardDuration = 15000.0f;

        Timer timer;
        AutoResetEvent resetEvent = null;
        const int updatePeriod = 1;

        List<GameResults> gameResults;

        List<string> botNames;
        Random random;

        public GameRoom() {
            State = GameState.Game;
            TimeRemaining = gameDuration;
            previousTime = DateTime.UtcNow;

            timer = new Timer(Update, resetEvent, updatePeriod, updatePeriod);

            gameResults = new List<GameResults>();
            
            botNames = new List<string>();
            botNames.Add("Ron");
            botNames.Add("Jen");
            botNames.Add("Andrew");
            botNames.Add("Christian");
            botNames.Add("Carlton");
            botNames.Add("Jai");
            botNames.Add("Jay");
            botNames.Add("Nikki");
            botNames.Add("Jimmy");
            botNames.Add("Denise");
            botNames.Add("Naomi");
            botNames.Add("Ally");
            botNames.Add("Suzie");
            botNames.Add("Dacia");
            botNames.Add("Lara");

            random = new Random();

            Debug.WriteLine("Initialized Game Room");
            Console.WriteLine("Initialized Game Room");
            LogState();
        }

        public void LogState() {
            Debug.WriteLine("GameRoom: State=" + State.ToString() + ", TimeRemaining=" + TimeRemaining.ToString());
            Console.WriteLine("GameRoom: State=" + State.ToString() + ", TimeRemaining=" + TimeRemaining.ToString());
        }

        public void AddGameResults(GameResults results) {
            gameResults.Add(results);
            Debug.WriteLine("Added GameResults: Name=" + results.Name + ", Score=" + results.Score);
            Console.WriteLine("Added GameResults: Name=" + results.Name + ", Score=" + results.Score);
        }

        public List<GameResults> GetLeaderboard() {
            gameResults.Sort((x, y) => {
                if(x.Score < y.Score) 
                    return 1;
                if(x.Score > y.Score)
                    return -1;
                else
                    return 0;});

            return gameResults;
        }

        void Update(Object stateInfo) {
            float elapsed = (float)(DateTime.UtcNow - previousTime).TotalMilliseconds;
            previousTime = DateTime.UtcNow;
            
            TimeRemaining -= elapsed;

            switch(State) {
                case GameState.Game:
                    if(TimeRemaining <= 0.0f) {
                        State = GameState.Results;
                        TimeRemaining = resultsDuration;

                        gameResults.Clear();

                        Debug.WriteLine("Changed GameRoom state to Results");
                        Console.WriteLine("Changed GameRoom state to Results");
                        LogState();

                        foreach(string name in botNames) {
                            AddGameResults(new GameResults(name, random.Next(200) * 10));
                        }
                    }
                    break;

                case GameState.Results:
                    if(TimeRemaining <= 0.0f) {
                        State = GameState.Leaderboard;
                        TimeRemaining = leaderboardDuration;

                        Debug.WriteLine("Changed GameRoom state to Leaderboard");
                        Console.WriteLine("Changed GameRoom state to Leaderboard");
                        LogState();

                        for(int n = 0; n < GetLeaderboard().Count; n++) {
                            Debug.WriteLine("Rank=" + n + ", Name=" + GetLeaderboard()[n].Name + ", Score=" + GetLeaderboard()[n].Score);
                            Console.WriteLine("Rank=" + n + ", Name=" + GetLeaderboard()[n].Name + ", Score=" + GetLeaderboard()[n].Score);
                        }
                    }
                    break;

                case GameState.Leaderboard:
                    if(TimeRemaining <= 0.0f) {
                        State = GameState.Game;
                        TimeRemaining = gameDuration;

                        Debug.WriteLine("Changed GameRoom state to Game");
                        Console.WriteLine("Changed GameRoom state to Game");
                        LogState();
                    }
                    break;
            }
        }
    }
}