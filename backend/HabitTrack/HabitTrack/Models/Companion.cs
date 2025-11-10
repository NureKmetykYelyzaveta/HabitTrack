using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace HabitTrack.Models
{
    public class Companion
    {
        [Key]
        [Column("companion_id")]
        public int CompanionId { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }
    public User? User { get; set; }

    [Column("name")]
    public string Name { get; set; } = null!;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CompanionSlot> Slots { get; set; } = new List<CompanionSlot>();
    }
}
