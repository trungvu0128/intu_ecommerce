namespace LotusEcommerce.Application.Constants;

public static class Permissions
{
    public const string AdminOnly = "AdminOnly";
    public const string AdminOrStaff = "AdminOrStaff";
    
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string Staff = "Staff";
        public const string Customer = "Customer";
    }
}
