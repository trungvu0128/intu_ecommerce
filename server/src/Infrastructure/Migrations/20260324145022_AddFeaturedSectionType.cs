using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LotusEcommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFeaturedSectionType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "FeaturedSections",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "FeaturedSections",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturedSections_CategoryId",
                table: "FeaturedSections",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_FeaturedSections_Categories_CategoryId",
                table: "FeaturedSections",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FeaturedSections_Categories_CategoryId",
                table: "FeaturedSections");

            migrationBuilder.DropIndex(
                name: "IX_FeaturedSections_CategoryId",
                table: "FeaturedSections");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "FeaturedSections");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "FeaturedSections");
        }
    }
}
