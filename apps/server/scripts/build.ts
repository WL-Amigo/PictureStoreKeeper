import { execFile } from "child_process";
import { join as pathJoin, resolve as pathResolve } from "path";
import { mkdirp, move, copy, remove } from "fs-extra";

const buildBackend = (): Promise<void> => {
  return new Promise<void>((res, rej) => {
    execFile(
      "go",
      [
        "build",
        "-ldflags",
        "-s -w",
        "-o",
        "picture-store-keeper-backend",
        "main.go",
      ],
      { cwd: pathResolve("./backend") },
      (error) => {
        if (error) {
          rej(error);
          return;
        }

        res();
      }
    );
  });
};

(async () => {
  // build backend
  await buildBackend();

  // package frontend and backend
  const distDir = "./dist/linux_x64/";
  await remove(distDir);
  await mkdirp(distDir);
  await move(
    "./backend/picture-store-keeper-backend",
    pathJoin(distDir, "picture-store-keeper")
  );
  await copy("../../core/ui/dist/", pathJoin(distDir, "frontend-dist/"));
})().catch((reason) => {
  console.error(reason);
  process.exit(1);
});
