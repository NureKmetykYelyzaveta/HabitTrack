using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabitTrack.Migrations
{
    /// <inheritdoc />
    public partial class AddSelectedAvatar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "selected_avatar",
                table: "User",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "selected_avatar",
                table: "User");
        }
    }
}
