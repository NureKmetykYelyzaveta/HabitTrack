using Microsoft.EntityFrameworkCore;
using HabitTrack.Models;

namespace HabitTrack.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Налаштовуємо маппінг полів для таблиці Users
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.UserId).HasColumnName("userid");
                entity.Property(e => e.Username).HasColumnName("username");
                entity.Property(e => e.Email).HasColumnName("email");
                entity.Property(e => e.Password).HasColumnName("password");
                entity.Property(e => e.CreatedAt).HasColumnName("createdat");
                entity.Property(e => e.Role).HasColumnName("role");
                entity.Property(e => e.AvatarImage).HasColumnName("AvatarImage");
                entity.Property(e => e.AvatarContentType).HasColumnName("AvatarContentType");
            });
        }
    }
}
