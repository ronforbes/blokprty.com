using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace blokprty.com_new.Controllers
{
    [Route("api/[controller]")]
    public class LeaderboardController : Controller
    {
        // GET api/values
        [HttpGet]
        public List<GameResults> Get()
        {
            return GameRoom.Instance.GetLeaderboard();
        }
    }
}
