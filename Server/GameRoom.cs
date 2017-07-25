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

        public GameRoom() {
            State = GameState.Game;
            TimeRemaining = gameDuration;
            previousTime = DateTime.UtcNow;

            timer = new Timer(Update, resetEvent, updatePeriod, updatePeriod);

            gameResults = new List<GameResults>();
            
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
                if(x.Score > y.Score) 
                    return 1;
                if(x.Score < y.Score)
                    return -1;
                else
                    return 0;});

            Debug.WriteLine("Sorted gameResults: " + gameResults.ToString());
            Console.WriteLine("Sorted gameResults: " + gameResults.ToString());

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
                    }
                    break;

                case GameState.Results:
                    if(TimeRemaining <= 0.0f) {
                        State = GameState.Leaderboard;
                        TimeRemaining = leaderboardDuration;

                        Debug.WriteLine("Changed GameRoom state to Leaderboard");
                        Console.WriteLine("Changed GameRoom state to Leaderboard");
                        LogState();
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