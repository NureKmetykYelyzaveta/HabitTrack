using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace HabitTrack.Models
{
    public class User
    {
        [Key]
        [Column("user_id")]
        public int UserId { get; set; }

    [Column("username")]
    public string Username { get; set; } = null!;

    [Column("email")]
    public string Email { get; set; } = null!;

    [Column("password")]
    public string Password { get; set; } = null!;

        [Column("role")]
        public string Role { get; set; } = "user";

        [Column("profile_photo_url")]
        public string? ProfilePhotoUrl { get; set; }

        [Column("balance")]
        public int Balance { get; set; } = 0;

        [Column("profile_link")]
        public string? ProfileLink { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
    public ICollection<Habit> Habits { get; set; } = new List<Habit>();
    public Companion? Companion { get; set; }
    public ICollection<UserInventory> Inventory { get; set; } = new List<UserInventory>();
    }
}
