using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HabitTrack.Models
{
    public class Clothes
    {
        [Key]
        [Column("clothes_id")]
        public int ClothesId { get; set; }

    [Column("name")]
    public string Name { get; set; } = null!;

    [Column("category")]
    public string Category { get; set; } = null!;

    [Column("price")]
    public int Price { get; set; }

    [Column("photo_url")]
    public string PhotoUrl { get; set; } = null!;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
