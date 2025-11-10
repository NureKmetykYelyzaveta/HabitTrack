using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HabitTrack.Models
{
    public class CompanionSlot
    {
        [Key]
        [Column("slot_id")]
        public int SlotId { get; set; }

    [Column("companion_id")]
    public int CompanionId { get; set; }
    public Companion? Companion { get; set; }

    [Column("slot_type")]
    public string SlotType { get; set; } = null!;

    [Column("equipped_clothes_id")]
    public int? EquippedClothesId { get; set; }
    public Clothes? EquippedClothes { get; set; }
    }
}
