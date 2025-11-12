using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace HabitTrack.Models
{
    public class Habit
    {
        [Key]
        [Column("habit_id")]
        public int HabitId { get; set; }


    [Column("user_id")]
    public int UserId { get; set; }
    public User? User { get; set; }

    [Column("name")]
    public string Name { get; set; } = null!;

    [Column("category")]
    public string Category { get; set; } = null!;
        [Column("repeat_count")]
        public int RepeatCount { get; set; } = 0;

    [Column("note")]
    public string? Note { get; set; }

        [Column("streak")]
        public int Streak { get; set; } = 0;

        [Column("last_check_date")]
        public DateTime? LastCheckDate { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("archived")]
        public bool Archived { get; set; } = false;

    public ICollection<HabitCompletion> Completions { get; set; } = new List<HabitCompletion>();
    }
}
