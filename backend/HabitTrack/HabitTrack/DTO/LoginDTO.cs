using System.ComponentModel.DataAnnotations;

namespace HabitTrack.DTO
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Email обов'язковий")]
        [EmailAddress(ErrorMessage = "Некоректний формат email")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Пароль обов'язковий")]
        public string Password { get; set; } = null!;
    }
}