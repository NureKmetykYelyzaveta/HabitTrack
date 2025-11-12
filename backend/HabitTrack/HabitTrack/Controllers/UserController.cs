using HabitTrack.Data;
using HabitTrack.DTO;
using HabitTrack.Models;
using HabitTrack.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System;
using System.Linq;
using Microsoft.AspNetCore.Http;

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
        public async Task<IActionResult> UploadAvatar(int id, IFormFile file)
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

            // Зберігаємо файл у wwwroot/uploads та зберігаємо посилання
            var uploads = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads");
            if (!Directory.Exists(uploads)) Directory.CreateDirectory(uploads);

            var fileExt = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{fileExt}";
            var savePath = Path.Combine(uploads, fileName);
            using (var fs = new FileStream(savePath, FileMode.Create))
            {
                await file.CopyToAsync(fs);
            }

            // Store relative url
            user.ProfilePhotoUrl = $"/uploads/{fileName}";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Аватар успішно оновлено" });
        }

        [HttpGet("{id}/avatar")]
        public async Task<IActionResult> GetAvatar(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
                return NotFound("Користувача не знайдено.");

            if (string.IsNullOrEmpty(user.ProfilePhotoUrl))
                return NotFound("Аватар не знайдено.");

            var relative = user.ProfilePhotoUrl.TrimStart('/');
            var filePath = Path.Combine(_environment.WebRootPath ?? "wwwroot", relative.Replace('/', Path.DirectorySeparatorChar));
            if (!System.IO.File.Exists(filePath))
                return NotFound("Файл аватара не знайдено на сервері.");

            var ext = Path.GetExtension(filePath).ToLower();
            var contentType = ext switch
            {
                ".png" => "image/png",
                ".jpg" => "image/jpeg",
                ".jpeg" => "image/jpeg",
                _ => "application/octet-stream"
            };

            return PhysicalFile(filePath, contentType);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
            if (user == null)
                return NotFound("Користувача не знайдено.");
            var avatarUrl = !string.IsNullOrEmpty(user.ProfilePhotoUrl) ? $"/api/user/{user.UserId}/avatar" : null;
            
            return Ok(new
            {
                user.UserId,
                user.Username,
                user.Email,
                user.Role,
                user.Balance,
                AvatarUrl = avatarUrl,
                user.CreatedAt
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UpdateUserDto dto)
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

            var avatarUrl = !string.IsNullOrEmpty(user.ProfilePhotoUrl) ? $"/api/user/{user.UserId}/avatar" : null;
            
            return Ok(new
            {
                user.UserId,
                user.Username,
                user.Email,
                user.Role,
                user.Balance,
                AvatarUrl = avatarUrl,
                user.CreatedAt
            });
        }

        [HttpPut("{id}/password")]
        public async Task<IActionResult> ChangePassword(int id, ChangePasswordDto dto)
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
