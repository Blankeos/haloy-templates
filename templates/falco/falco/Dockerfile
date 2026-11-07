FROM falcosecurity/falco:0.45.0
CMD ["/usr/bin/falco","-o","engine.kind=modern_ebpf","-o","json_output=true","-o","json_include_output_property=true","-o","stdout_output.enabled=true","-o","http_output.enabled=true","-o","http_output.url=http://falcosidekick:2801/","-o","priority=notice"]
