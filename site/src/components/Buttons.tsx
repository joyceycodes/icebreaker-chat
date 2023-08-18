"use client"
import { Button } from '@mantine/core';

interface ButtonsProps {
    text: string;
    onClick: () => void;
}

export function Buttons({text, onClick}:ButtonsProps){
    return (
        <Button variant="outline" radius="lg" size="xl" onClick={onClick}>
        {text}
      </Button>
    )
}