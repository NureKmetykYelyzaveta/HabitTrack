using HabitTrack.Data;
using HabitTrack.DTO;
using HabitTrack.Models;
using HabitTrack.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HabitTrack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto dto)
        {
            // 1. Перевірка чи пошта вже існує
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "Email вже зареєстрований." });
            }

            // 2. Перевірка пароля
            if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 8)
            {
                return BadRequest(new { message = "Пароль має бути мінімум 8 символів." });
            }
            if (!dto.Password.Any(char.IsUpper))
            {
                return BadRequest(new { message = "Пароль має містити хоча б одну велику літеру." });
            }
            if (!dto.Password.Any(char.IsDigit))
            {
                return BadRequest(new { message = "Пароль має містити хоча б одну цифру." });
            }

            // 3. Створення користувача
            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = PasswordHasher.HashPassword(dto.Password),
                // avatar буде завантажуватись окремо
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { user.UserId, user.Username, user.Email });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto, [FromServices] JwtService jwtService)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
                return Unauthorized("Користувача не знайдено.");

            if (!PasswordHasher.VerifyPassword(dto.Password, user.Password))
                return Unauthorized("Неправильний пароль.");

            var token = jwtService.GenerateToken(user);

            var avatarUrl = !string.IsNullOrEmpty(user.ProfilePhotoUrl) ? $"/api/user/{user.UserId}/avatar" : null;

            return Ok(new
            {
                user.UserId,
                user.Username,
                user.Email,
                user.Role,
                AvatarUrl = avatarUrl,
                Token = token
            });
        }
    }
}