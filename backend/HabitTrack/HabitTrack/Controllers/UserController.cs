using HabitTrack.Data;
using HabitTrack.DTO;
using HabitTrack.Models;
using HabitTrack.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HabitTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public UserController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        [HttpPost("{id}/avatar")]
        public async Task<IActionResult> UploadAvatar(Guid id, IFormFile file)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
                return NotFound("Користувача не знайдено.");

            if (file == null || file.Length == 0)
                return BadRequest("Файл не вибрано.");

            // Перевіряємо тип файлу
            var allowedContentTypes = new[] { "image/jpeg", "image/jpg", "image/png" };
            if (!allowedContentTypes.Contains(file.ContentType.ToLower()))
                return BadRequest("Дозволені тільки зображення формату JPG або PNG");

            // Зчитуємо файл у масив байтів
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                user.AvatarImage = ms.ToArray();
                user.AvatarContentType = file.ContentType;
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Аватар успішно оновлено" });
        }

        [HttpGet("{id}/avatar")]
        public async Task<IActionResult> GetAvatar(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
                return NotFound("Користувача не знайдено.");

            if (user.AvatarImage == null || user.AvatarContentType == null)
                return NotFound("Аватар не знайдено.");

            return File(user.AvatarImage, user.AvatarContentType);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(Guid id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
                return NotFound("Користувача не знайдено.");

            var avatarUrl = user.AvatarImage != null ? $"/api/user/{user.UserId}/avatar" : null;
            
            return Ok(new
            {
                user.UserId,
                user.Username,
                user.Email,
                user.Role,
                AvatarUrl = avatarUrl,
                user.CreatedAt
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(Guid id, UpdateUserDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
                return NotFound("Користувача не знайдено.");

            // Перевіряємо чи email не зайнятий іншим користувачем
            if (dto.Email != user.Email && _context.Users.Any(u => u.Email == dto.Email))
            {
                return BadRequest("Email вже зареєстрований.");
            }

            // Оновлюємо поля
            user.Username = dto.Username ?? user.Username;
            user.Email = dto.Email ?? user.Email;

            await _context.SaveChangesAsync();

            var avatarUrl = user.AvatarImage != null ? $"/api/user/{user.UserId}/avatar" : null;
            
            return Ok(new
            {
                user.UserId,
                user.Username,
                user.Email,
                user.Role,
                AvatarUrl = avatarUrl,
                user.CreatedAt
            });
        }

        [HttpPut("{id}/password")]
        public async Task<IActionResult> ChangePassword(Guid id, ChangePasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
                return NotFound("Користувача не знайдено.");

            // Перевіряємо поточний пароль
            if (!PasswordHasher.VerifyPassword(dto.CurrentPassword, user.Password))
                return BadRequest("Неправильний поточний пароль.");

            // Валідація нового пароля
            if (string.IsNullOrEmpty(dto.NewPassword) || dto.NewPassword.Length < 8)
                return BadRequest("Новий пароль має містити мінімум 8 символів.");

            // Оновлюємо пароль
            user.Password = PasswordHasher.HashPassword(dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Пароль успішно змінено." });
        }
    }
}
