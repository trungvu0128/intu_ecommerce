using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LotusEcommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFeaturedGridLayout : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AspectRatio",
                table: "FeaturedSections",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AspectRatio",
                table: "FeaturedSectionItems",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GridType",
                table: "FeaturedSectionItems",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AspectRatio",
                table: "FeaturedSections");

            migrationBuilder.DropColumn(
                name: "AspectRatio",
                table: "FeaturedSectionItems");

            migrationBuilder.DropColumn(
                name: "GridType",
                table: "FeaturedSectionItems");
        }
    }
}
