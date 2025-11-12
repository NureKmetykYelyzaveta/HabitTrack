using System.ComponentModel.DataAnnotations;

namespace HabitTrack.DTO
{
    public class RegisterUserDto
    {
        [Required(ErrorMessage = "Ім'я користувача обов'язкове")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Ім'я має містити від 3 до 50 символів")]
        public string Username { get; set; } = null!;

        [Required(ErrorMessage = "Email обов'язковий")]
        [EmailAddress(ErrorMessage = "Некоректний формат email")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Пароль обов'язковий")]
        [StringLength(100, MinimumLength = 8, ErrorMessage = "Пароль має бути мінімум 8 символів")]
        public string Password { get; set; } = null!;

        public string? AvatarUrl { get; set; }
    }
}