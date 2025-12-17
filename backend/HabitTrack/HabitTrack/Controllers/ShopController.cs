using HabitTrack.Data;
using HabitTrack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HabitTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShopController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ShopController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/shop/items - Отримати всі костюми в магазині
        [HttpGet("items")]
        public async Task<IActionResult> GetShopItems([FromQuery] int userId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Inventory)
                    .ThenInclude(i => i.Clothes)
                    .FirstOrDefaultAsync(u => u.UserId == userId);

                if (user == null)
                    return NotFound(new { message = "Користувача не знайдено." });

                // Отримуємо всі костюми
                var allClothes = await _context.Clothes
                    .OrderBy(c => c.ClothesId)
                    .ToListAsync();

                // Отримуємо ID куплених костюмів
                var purchasedClothesIds = user.Inventory.Select(i => i.ClothesId).ToHashSet();

                // Розділяємо на доступні та куплені
                var availableItems = allClothes
                    .Where(c => !purchasedClothesIds.Contains(c.ClothesId))
                    .Select(c => new
                    {
                        c.ClothesId,
                        c.Name,
                        c.Category,
                        c.Price,
                        c.PhotoUrl,
                        IsPurchased = false
                    })
                    .ToList();

                var purchasedItems = allClothes
                    .Where(c => purchasedClothesIds.Contains(c.ClothesId))
                    .Select(c => new
                    {
                        c.ClothesId,
                        c.Name,
                        c.Category,
                        c.Price,
                        c.PhotoUrl,
                        IsPurchased = true
                    })
                    .ToList();

                // Спочатку доступні, потім куплені
                var result = availableItems.Concat(purchasedItems).ToList();

                return Ok(new
                {
                    items = result,
                    userBalance = user.Balance
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Помилка при завантаженні магазину.", error = ex.Message });
            }
        }

        // POST: api/shop/purchase - Купити костюм
        [HttpPost("purchase")]
        public async Task<IActionResult> PurchaseItem([FromBody] PurchaseRequest request)
        {
            try
            {
                if (request.UserId <= 0 || request.ClothesId <= 0)
                    return BadRequest(new { message = "Невірні параметри запиту." });

                var user = await _context.Users
                    .Include(u => u.Inventory)
                    .FirstOrDefaultAsync(u => u.UserId == request.UserId);

                if (user == null)
                    return NotFound(new { message = "Користувача не знайдено." });

                var clothes = await _context.Clothes.FindAsync(request.ClothesId);
                if (clothes == null)
                    return NotFound(new { message = "Костюм не знайдено." });

                // Перевіряємо чи вже куплено
                if (user.Inventory.Any(i => i.ClothesId == request.ClothesId))
                    return BadRequest(new { message = "Цей костюм вже куплено." });

                // Перевіряємо баланс
                if (user.Balance < clothes.Price)
                    return BadRequest(new { message = "Недостатньо коштів." });

                // Віднімаємо кошти
                user.Balance -= clothes.Price;

                // Додаємо до інвентаря
                var inventoryItem = new UserInventory
                {
                    UserId = request.UserId,
                    ClothesId = request.ClothesId,
                    PurchasedAt = DateTime.UtcNow
                };

                _context.UserInventories.Add(inventoryItem);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Костюм успішно придбано!",
                    newBalance = user.Balance
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Помилка при покупці костюма.", error = ex.Message });
            }
        }

        // GET: api/shop/inventory/{userId} - Отримати інвентарь користувача
        [HttpGet("inventory/{userId}")]
        public async Task<IActionResult> GetUserInventory(int userId)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Inventory)
                    .ThenInclude(i => i.Clothes)
                    .FirstOrDefaultAsync(u => u.UserId == userId);

                if (user == null)
                    return NotFound(new { message = "Користувача не знайдено." });

                var inventory = user.Inventory
                    .Where(i => i.Clothes != null)
                    .Select(i => new
                    {
                        i.InventoryId,
                        i.ClothesId,
                        i.Clothes!.Name,
                        i.Clothes.Category,
                        i.Clothes.PhotoUrl,
                        i.PurchasedAt
                    })
                    .OrderByDescending(i => i.PurchasedAt)
                    .ToList();

                return Ok(new { inventory });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Помилка при завантаженні інвентаря.", error = ex.Message });
            }
        }
    }

    public class PurchaseRequest
    {
        public int UserId { get; set; }
        public int ClothesId { get; set; }
    }
}

