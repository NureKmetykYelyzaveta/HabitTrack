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
        public DbSet<Habit> Habits { get; set; }
        public DbSet<HabitCompletion> HabitCompletions { get; set; }
        public DbSet<Companion> Companions { get; set; }
        public DbSet<CompanionSlot> CompanionSlots { get; set; }
        public DbSet<Clothes> Clothes { get; set; }
        public DbSet<UserInventory> UserInventories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Username).HasColumnName("username").IsRequired();
                entity.Property(e => e.Email).HasColumnName("email").IsRequired();
                entity.Property(e => e.Password).HasColumnName("password").IsRequired();
                entity.Property(e => e.Role).HasColumnName("role").HasDefaultValue("user");
                entity.Property(e => e.ProfilePhotoUrl).HasColumnName("profile_photo_url");
                entity.Property(e => e.Balance).HasColumnName("balance").HasDefaultValue(0);
                entity.Property(e => e.ProfileLink).HasColumnName("profile_link");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // Habit
            modelBuilder.Entity<Habit>(entity =>
            {
                entity.ToTable("habit");
                entity.HasKey(e => e.HabitId);
                entity.Property(e => e.HabitId).HasColumnName("habit_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.RepeatCount).HasColumnName("repeat_count").HasDefaultValue(0);
                entity.Property(e => e.Note).HasColumnName("note");
                entity.Property(e => e.Streak).HasColumnName("streak").HasDefaultValue(0);
                entity.Property(e => e.LastCheckDate).HasColumnName("last_check_date");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(e => e.User).WithMany(u => u.Habits).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            // HabitCompletion
            modelBuilder.Entity<HabitCompletion>(entity =>
            {
                entity.ToTable("habit_completion");
                entity.HasKey(e => e.CompletionId);
                entity.Property(e => e.CompletionId).HasColumnName("completion_id");
                entity.Property(e => e.HabitId).HasColumnName("habit_id");
                entity.Property(e => e.CompletedAt).HasColumnName("completed_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.CoinsEarned).HasColumnName("coins_earned");

                entity.HasOne(e => e.Habit).WithMany(h => h.Completions).HasForeignKey(e => e.HabitId).OnDelete(DeleteBehavior.Cascade);
            });

            // Companion
            modelBuilder.Entity<Companion>(entity =>
            {
                entity.ToTable("companion");
                entity.HasKey(e => e.CompanionId);
                entity.Property(e => e.CompanionId).HasColumnName("companion_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(e => e.User).WithOne(u => u.Companion).HasForeignKey<Companion>(c => c.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(e => e.UserId).IsUnique();
            });

            // CompanionSlot
            modelBuilder.Entity<CompanionSlot>(entity =>
            {
                entity.ToTable("companion_slot");
                entity.HasKey(e => e.SlotId);
                entity.Property(e => e.SlotId).HasColumnName("slot_id");
                entity.Property(e => e.CompanionId).HasColumnName("companion_id");
                entity.Property(e => e.SlotType).HasColumnName("slot_type");
                entity.Property(e => e.EquippedClothesId).HasColumnName("equipped_clothes_id");

                entity.HasOne(e => e.Companion).WithMany(c => c.Slots).HasForeignKey(e => e.CompanionId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.EquippedClothes).WithMany().HasForeignKey(e => e.EquippedClothesId).OnDelete(DeleteBehavior.SetNull);
                entity.HasIndex(e => new { e.CompanionId, e.SlotType }).IsUnique();
            });

            // Clothes
            modelBuilder.Entity<Clothes>(entity =>
            {
                entity.ToTable("clothes");
                entity.HasKey(e => e.ClothesId);
                entity.Property(e => e.ClothesId).HasColumnName("clothes_id");
                entity.Property(e => e.Name).HasColumnName("name");
                entity.Property(e => e.Category).HasColumnName("category");
                entity.Property(e => e.Price).HasColumnName("price");
                entity.Property(e => e.PhotoUrl).HasColumnName("photo_url");
                entity.Property(e => e.CreatedAt).HasColumnName("created_at").HasDefaultValueSql("CURRENT_TIMESTAMP");
            });

            // UserInventory
            modelBuilder.Entity<UserInventory>(entity =>
            {
                entity.ToTable("user_inventory");
                entity.HasKey(e => e.InventoryId);
                entity.Property(e => e.InventoryId).HasColumnName("inventory_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.ClothesId).HasColumnName("clothes_id");
                entity.Property(e => e.PurchasedAt).HasColumnName("purchased_at").HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne(e => e.User).WithMany(u => u.Inventory).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.Clothes).WithMany().HasForeignKey(e => e.ClothesId).OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(e => new { e.UserId, e.ClothesId }).IsUnique();
            });
        }
    }
}
