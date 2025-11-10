using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HabitTrack.Models
{
    public class HabitCompletion
    {
        [Key]
        [Column("completion_id")]
        public int CompletionId { get; set; }

    [Column("habit_id")]
    public int HabitId { get; set; }
    public Habit? Habit { get; set; }

    [Column("completed_at")]
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

        [Column("coins_earned")]
        public int CoinsEarned { get; set; }
    }
}
