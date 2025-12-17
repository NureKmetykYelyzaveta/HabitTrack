using HabitTrack.Data;
using HabitTrack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HabitTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InitController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InitController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/init/clothes - Ініціалізувати костюми в базі даних
        [HttpPost("clothes")]
        public async Task<IActionResult> InitializeClothes()
        {
            try
            {
                // Перевіряємо чи вже є костюми
                if (await _context.Clothes.AnyAsync())
                {
                    return Ok(new { message = "Костюми вже ініціалізовані." });
                }

                var clothes = new List<Clothes>();
                
                // Створюємо костюми для character-1.png до character-14.png
                for (int i = 1; i <= 14; i++)
                {
                    clothes.Add(new Clothes
                    {
                        Name = $"Персонаж {i}",
                        Category = "avatar",
                        Price = (i * 50) + 100, // Ціна від 150 до 800 монет
                        PhotoUrl = $"character-{i}.png",
                        CreatedAt = DateTime.UtcNow
                    });
                }

                _context.Clothes.AddRange(clothes);
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    message = $"Успішно створено {clothes.Count} костюмів.",
                    count = clothes.Count 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Помилка при ініціалізації костюмів.", error = ex.Message });
            }
        }
    }
}

