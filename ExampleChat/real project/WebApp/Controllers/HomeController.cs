using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApp.ViewModel.Home;

namespace WebApp.Controllers
{
    [AllowAnonymous]
    [Route("")]
    [Route("Home")]
    public class HomeController : Controller
    {
        [HttpGet]
        [Route("")]
        [Route("Index")]
        public IActionResult Index()
        {
            HomeViewModel model = new HomeViewModel();
            return View(model);
        }

        [HttpGet]
        [Route("Error")]
        public IActionResult Error(string message = null)
        {
            var model = new ErrorViewModel()
            {
                Message = message
            };
            return View("Error", model);
        }

        [HttpGet]
        [Route("Chat")]
        public IActionResult Chat()
        {
            return View("Chat");
        }

        public class ChatConversationRequest
        {
            /// <summary>
            /// This property is used to reference the database record for the conversation.
            /// On the first request to the page, this value should be null and a record will be created and return the value.
            /// All subsequent calls, you must send this value.
            /// </summary>
            public string ConversationStorageKey { get; set; }

            /// <summary>
            /// The message from the user
            /// </summary>
            public string UserMessage { get; set; }
        }

        public class ChatConversationResponse
        {
            /// <summary>
            /// This property is used to reference the database record for the conversation.
            /// On the first request to the page, this value should be null and a record will be created and return the value.
            /// All subsequent calls, you must send this value.
            /// </summary>
            public string ConversationStorageKey { get; set; }

            /// <summary>
            /// The messages from the system.
            /// </summary>
            public List<string> SystemMessages { get; set; }
        }

        [HttpPost]
        [Route("ChatConversation")]
        public IActionResult ChatConversation(ChatConversationRequest request)


        {
            Console.WriteLine($"ConversationStorageKey: {request?.ConversationStorageKey}");
            Console.WriteLine($"UserMessage: {request?.UserMessage}");

            if (request == null) request = new ChatConversationRequest();

            ChatConversationResponse response = new ChatConversationResponse();
            if (string.IsNullOrEmpty(request.ConversationStorageKey))
            {
                // start a conversation
                response.ConversationStorageKey = Guid.NewGuid().ToString();
            }
            else
            {
                // continue a conversation
                response.ConversationStorageKey = request.ConversationStorageKey;
            }

            // Add the response messages
            response.SystemMessages = new List<string>()
            {
                "This is a system response",
                "This is a second system response"
            };
            return Json(response);
        }
    }
}