using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HabitTrack.Models
{
    public class UserInventory
    {
        [Key]
        [Column("inventory_id")]
        public int InventoryId { get; set; }

    [Column("user_id")]
    public int UserId { get; set; }
    public User? User { get; set; }

    [Column("clothes_id")]
    public int ClothesId { get; set; }
    public Clothes? Clothes { get; set; }

        [Column("purchased_at")]
        public DateTime PurchasedAt { get; set; } = DateTime.UtcNow;
    }
}
