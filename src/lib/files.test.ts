import { describe, expect, it } from "vitest";
import { audioType, imageType } from "./files";

describe("tipo real dos arquivos", () => {
  it("reconhece imagens pelo conteúdo", () => {
    expect(imageType(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0]))?.mime).toBe("image/jpeg");
    expect(imageType(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))?.mime).toBe("image/png");
    expect(imageType(Buffer.from("RIFF\0\0\0\0WEBPVP8 "))?.mime).toBe("image/webp");
    expect(imageType(Buffer.from("<script>alert(1)</script>"))).toBeNull();
  });
  it("reconhece áudio gravado no celular", () => {
    expect(audioType(Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 1]))?.mime).toBe("audio/webm");
    expect(audioType(Buffer.from("\0\0\0\x18ftypM4A "))?.mime).toBe("audio/mp4");
    expect(audioType(Buffer.from("OggS\0"))?.mime).toBe("audio/ogg");
    expect(audioType(Buffer.from("texto"))).toBeNull();
  });
});
