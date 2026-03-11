# kaiyu.io-tools

A collection of developer tool components built with [Astro](https://astro.build), used as a git submodule.

## Tools

| Component | Description |
|---|---|
| `Base64Tool` | Base64 encode / decode |
| `TimestampTool` | Unix timestamp converter |
| `UuidGeneratorTool` | UUID v4 generator |
| `RegexTesterTool` | Regex tester with live matching |
| `CronParserTool` | Cron expression parser |
| `JsonYamlTool` | JSON ↔ YAML converter |
| `SqlFormatterTool` | SQL formatter |
| `QrCodeTool` | QR code generator |
| `TokenEstimatorTool` | LLM token estimator |
| `PromptBuilderTool` | AI prompt builder |
| `ClockTool` | World clock |
| `CoffeeTool` | Coffee break timer |

## Usage

Add as a git submodule:

```bash
git submodule add https://github.com/Lienkaiyu/kaiyu.io-tools.git src/components/tools
```

After cloning a project that uses this submodule:

```bash
git submodule update --init
```

## License

[MIT](./LICENSE)
