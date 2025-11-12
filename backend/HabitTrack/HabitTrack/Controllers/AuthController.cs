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
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(ApplicationDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto dto)
        {
            try
            {
                // 1. Перевірка вхідних даних
                if (string.IsNullOrWhiteSpace(dto.Username))
                {
                    return BadRequest(new { message = "Ім'я користувача обов'язкове." });
                }

                if (string.IsNullOrWhiteSpace(dto.Email))
                {
                    return BadRequest(new { message = "Email обов'язковий." });
                }

                if (string.IsNullOrWhiteSpace(dto.Password))
                {
                    return BadRequest(new { message = "Пароль обов'язковий." });
                }

                // 2. Перевірка унікальності email
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                {
                    return BadRequest(new { message = "Цей email вже зареєстрований." });
                }

                // 3. Перевірка унікальності username
                if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                {
                    return BadRequest(new { message = "Це ім'я користувача вже занято." });
                }

                // 4. Валідація пароля
                if (dto.Password.Length < 8)
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

                // 5. Валідація email формату
                if (!dto.Email.Contains("@") || !dto.Email.Contains("."))
                {
                    return BadRequest(new { message = "Некоректний формат email." });
                }

                // 6. Створення користувача
                var user = new User
                {
                    Username = dto.Username.Trim(),
                    Email = dto.Email.Trim().ToLower(),
                    Password = PasswordHasher.HashPassword(dto.Password),
                    Role = "user",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new 
                { 
                    message = "Акаунт успішно створено.",
                    user = new 
                    { 
                        user.UserId, 
                        user.Username, 
                        user.Email 
                    }
                });
            }
            catch
            {
                return StatusCode(500, new { message = "Помилка при реєстрації. Спробуйте ще раз." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            try
            {
                // 1. Перевірка вхідних даних
                if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                {
                    return BadRequest(new { message = "Email та пароль обов'язкові." });
                }

                // 2. Пошук користувача за email
                var user = await _context.Users
                    .Include(u => u.Companion)
                    .FirstOrDefaultAsync(u => u.Email == dto.Email.Trim().ToLower());

                if (user == null)
                {
                    return Unauthorized(new { message = "Email або пароль неправильні." });
                }

                // 3. Перевірка пароля
                if (!PasswordHasher.VerifyPassword(dto.Password, user.Password))
                {
                    return Unauthorized(new { message = "Email або пароль неправильні." });
                }

                // 4. Генерація JWT токена
                var token = _jwtService.GenerateToken(user);

                // 5. Формування URL аватара
                var avatarUrl = !string.IsNullOrEmpty(user.ProfilePhotoUrl) 
                    ? $"/api/user/{user.UserId}/avatar" 
                    : null;

                return Ok(new
                {
                    message = "Вхід виконано успішно.",
                    user = new
                    {
                        user.UserId,
                        user.Username,
                        user.Email,
                        user.Role,
                        user.Balance,
                        AvatarUrl = avatarUrl,
                        CompanionId = user.Companion?.CompanionId
                    },
                    token = token
                });
            }
            catch
            {
                return StatusCode(500, new { message = "Помилка при вході. Спробуйте ще раз." });
            }
        }
    }
}