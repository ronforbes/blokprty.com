using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace blokprty.com_new.Controllers
{
    [Route("api/[controller]")]
    public class GameResultsController : Controller
    {
        // POST api/gameresults
        [HttpPost]
        public void Post([FromBody]GameResults results)
        {
            Console.WriteLine("Received game results:" + results.ToString());
            GameRoom.Instance.AddGameResults(results);
        }
    }
}
