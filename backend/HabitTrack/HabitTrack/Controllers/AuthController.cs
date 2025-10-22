using HabitTrack.Data;
using HabitTrack.DTO;
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
            if (_context.Users.Any(u => u.Email == dto.Email))
            {
                return BadRequest("Email вже зареєстрований.");
            }

            var user = new User
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = PasswordHasher.HashPassword(dto.Password),
                // avatar will be uploaded separately via /api/user/{id}/avatar
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { user.UserId, user.Username, user.Email });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
                return Unauthorized("Користувача не знайдено.");

            if (!PasswordHasher.VerifyPassword(dto.Password, user.Password))
                return Unauthorized("Неправильний пароль.");

            var avatarUrl = user.AvatarImage != null ? $"/api/user/{user.UserId}/avatar" : null;
            return Ok(new
            {
                user.UserId,
                user.Username,
                user.Email,
                user.Role,
                AvatarUrl = avatarUrl
            });
        }
    }
}