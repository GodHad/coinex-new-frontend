export interface ModelInfo {
    name: string;
    size: string;
    details: {
        parameter_size: string;
        quantization_level: string;
    };
    metadata?: {
        tags: string[];
        notes: string;
        performance: {
            tasks: string[];
            rating: number;
            lastUsed?: string;
        };
    };
}