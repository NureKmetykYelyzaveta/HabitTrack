using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HabitTrack.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clothes",
                columns: table => new
                {
                    clothes_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    category = table.Column<string>(type: "text", nullable: false),
                    price = table.Column<int>(type: "integer", nullable: false),
                    photo_url = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clothes", x => x.clothes_id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    username = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    password = table.Column<string>(type: "text", nullable: false),
                    role = table.Column<string>(type: "text", nullable: false, defaultValue: "user"),
                    profile_photo_url = table.Column<string>(type: "text", nullable: true),
                    balance = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    profile_link = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.user_id);
                });

            migrationBuilder.CreateTable(
                name: "Companion",
                columns: table => new
                {
                    companion_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companion", x => x.companion_id);
                    table.ForeignKey(
                        name: "FK_Companion_User_user_id",
                        column: x => x.user_id,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Habit",
                columns: table => new
                {
                    habit_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    category = table.Column<string>(type: "text", nullable: false),
                    repeat_count = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    note = table.Column<string>(type: "text", nullable: true),
                    streak = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    last_check_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    archived = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Habit", x => x.habit_id);
                    table.ForeignKey(
                        name: "FK_Habit_User_user_id",
                        column: x => x.user_id,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserInventory",
                columns: table => new
                {
                    inventory_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    clothes_id = table.Column<int>(type: "integer", nullable: false),
                    purchased_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserInventory", x => x.inventory_id);
                    table.ForeignKey(
                        name: "FK_UserInventory_Clothes_clothes_id",
                        column: x => x.clothes_id,
                        principalTable: "Clothes",
                        principalColumn: "clothes_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserInventory_User_user_id",
                        column: x => x.user_id,
                        principalTable: "User",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CompanionSlot",
                columns: table => new
                {
                    slot_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    companion_id = table.Column<int>(type: "integer", nullable: false),
                    slot_type = table.Column<string>(type: "text", nullable: false),
                    equipped_clothes_id = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanionSlot", x => x.slot_id);
                    table.ForeignKey(
                        name: "FK_CompanionSlot_Clothes_equipped_clothes_id",
                        column: x => x.equipped_clothes_id,
                        principalTable: "Clothes",
                        principalColumn: "clothes_id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_CompanionSlot_Companion_companion_id",
                        column: x => x.companion_id,
                        principalTable: "Companion",
                        principalColumn: "companion_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HabitCompletion",
                columns: table => new
                {
                    completion_id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    habit_id = table.Column<int>(type: "integer", nullable: false),
                    completed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP"),
                    coins_earned = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HabitCompletion", x => x.completion_id);
                    table.ForeignKey(
                        name: "FK_HabitCompletion_Habit_habit_id",
                        column: x => x.habit_id,
                        principalTable: "Habit",
                        principalColumn: "habit_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Companion_user_id",
                table: "Companion",
                column: "user_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompanionSlot_companion_id_slot_type",
                table: "CompanionSlot",
                columns: new[] { "companion_id", "slot_type" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CompanionSlot_equipped_clothes_id",
                table: "CompanionSlot",
                column: "equipped_clothes_id");

            migrationBuilder.CreateIndex(
                name: "IX_Habit_user_id",
                table: "Habit",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_HabitCompletion_habit_id",
                table: "HabitCompletion",
                column: "habit_id");

            migrationBuilder.CreateIndex(
                name: "IX_UserInventory_clothes_id",
                table: "UserInventory",
                column: "clothes_id");

            migrationBuilder.CreateIndex(
                name: "IX_UserInventory_user_id_clothes_id",
                table: "UserInventory",
                columns: new[] { "user_id", "clothes_id" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanionSlot");

            migrationBuilder.DropTable(
                name: "HabitCompletion");

            migrationBuilder.DropTable(
                name: "UserInventory");

            migrationBuilder.DropTable(
                name: "Companion");

            migrationBuilder.DropTable(
                name: "Habit");

            migrationBuilder.DropTable(
                name: "Clothes");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
