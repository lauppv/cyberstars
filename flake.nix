{
  description = "CyberStars development shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }: let
    forAllSystems = nixpkgs.lib.genAttrs [ "x86_64-linux" "aarch64-linux" ];
  in {
    devShells = forAllSystems (system: let
      pkgs = import nixpkgs { inherit system; };
    in {
      default = pkgs.mkShell {
        packages = with pkgs; [
          nodejs_24
          prisma-engines
          openssl
        ];
        shellHook = ''
          source ${pkgs.prisma-engines_6}/nix-support/setup-hook
          export PRISMA_BINARY_TARGETS=linux
          export SANDBOX_RUN_AS_USER=false
          export LD_LIBRARY_PATH="${pkgs.lib.getLib pkgs.openssl}/lib:$LD_LIBRARY_PATH"
        '';
      };
    });
  };
}
