"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function TodoForm({ formData, setFormData }) {
    return (
        <div className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
                <label className="text-sm font-medium">
                    Title <span className="text-red-500">*</span>
                </label>

                <Input
                    placeholder="e.g. Complete Backend API"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            title: e.target.value,
                        })
                    }
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Description</label>

                    <span className="text-xs text-muted-foreground">
                        {formData.description?.length || 0}/500
                    </span>
                </div>

                <Textarea
                    rows={5}
                    maxLength={500}
                    placeholder="Describe your task..."
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>

                <Input
                    type="date"
                    value={formData.dueDate || ""}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            dueDate: e.target.value,
                        })
                    }
                />
            </div>

            {/* Status & Priority */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Status */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>

                    <Select
                        value={formData.status}
                        onValueChange={(value) =>
                            setFormData({
                                ...formData,
                                status: value,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="TODO">Todo</SelectItem>

                            <SelectItem value="IN_PROGRESS">
                                In Progress
                            </SelectItem>

                            <SelectItem value="COMPLETED">Completed</SelectItem>

                            <SelectItem value="CANCELED">Canceled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Priority</label>

                    <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                            setFormData({
                                ...formData,
                                priority: value,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>

                            <SelectItem value="MEDIUM">Medium</SelectItem>

                            <SelectItem value="HIGH">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
